import os
from core.settings import settings
from rest_framework import serializers
from users.models import CustomUser as User
from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import authenticate

from processing.models import Resume, Vacancy, JobMatching
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from core.parsers.resume_parser import ResumeParser
from core.ml_service import skill_extractor
import PyPDF2
from docx import Document
from natasha import (
     Segmenter,  # Разбиение текста на токены
     MorphVocab,  # Морфологический словарь
     NewsEmbedding,  # Предобученная модель
     NewsMorphTagger,  # Тэгер частей речи
     NewsSyntaxParser,  # Синтаксический парсер
     NewsNERTagger,  # Извлечение именованных сущностей (NER)
     Doc
)


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'lastName',
            'image'
        ]


class CustomUserLoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(**data)
        if user:
            return user
        raise serializers.ValidationError("Incorrect Credentials")


class CustomUserRegistrationSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ("id", "name", "lastName", "email", "password", "image")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ResumeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id',
            'name',
            'job',
            'matchPercentage',
            'skills',
            'missing_skills',
            'resume_file',
            'date',
            'file_name'
        ]
        read_only_fields = ['parsed_resume', 'name', 'file_name']

    @staticmethod
    def transform_skill_levels(skills):
        """Преобразует уровни навыков из 1-3 в 33-66-100"""
        level_mapping = {1: 33, 2: 66, 3: 100}
        return {skill: level_mapping.get(level, 0) for skill, level in skills.items()}

    @staticmethod
    def get_fullname(file_path):
        """Извлекает и очищает ФИО из файла резюме"""
        if not os.path.exists(file_path):
            print(f"Файл не найден: {file_path}")
            return None

        try:
            if file_path.endswith('.pdf'):
                with open(file_path, 'rb') as f:
                    pdf_reader = PyPDF2.PdfReader(f)
                    text = "\n".join([page.extract_text() for page in pdf_reader.pages])
            elif file_path.endswith('.docx'):
                doc = Document(file_path)
                text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
            else:
                print(f"Неподдерживаемый формат файла: {file_path}")
                return None

            segmenter = Segmenter()
            morph_vocab = MorphVocab()
            emb = NewsEmbedding()
            morph_tagger = NewsMorphTagger(emb)
            syntax_parser = NewsSyntaxParser(emb)
            ner_tagger = NewsNERTagger(emb)

            doc = Doc(text)
            doc.segment(segmenter)
            doc.tag_morph(morph_tagger)
            doc.parse_syntax(syntax_parser)
            doc.tag_ner(ner_tagger)

            for span in doc.spans:
                if span.type == "PER":
                    span.normalize(morph_vocab)
                    clean_name = ' '.join(span.text.split()[:2])
                    return clean_name

        except Exception as e:
            print(f"Ошибка при извлечении имени: {str(e)}")
            return None

    def create(self, validated_data):
        user = self.context['request'].user
        if not user.is_authenticated:
            raise serializers.ValidationError({'user': 'Требуется авторизация'})

        uploaded_file = validated_data.pop('resume_file', None)
        if not uploaded_file:
            raise serializers.ValidationError({'resume_file': 'Файл резюме обязателен'})

        try:
            resume = Resume.objects.create(user=user, **validated_data)
            file_path = os.path.join(settings.MEDIA_ROOT, resume.resume_file.name)
            parsed_resume = ResumeParser.parse_file(uploaded_file)
            skills = skill_extractor.extract_skills(parsed_resume)
            resume.parsed_resume = parsed_resume
            resume.skills = self.transform_skill_levels(skills)
            resume.name = self.get_fullname(file_path) or os.path.splitext(uploaded_file.name)[0]
            resume.file_name = uploaded_file.name

            suitable_job = None
            missing_skills = {}
            match_percentage = 0
            vacancies = Vacancy.objects.all()
            for vacancy in vacancies:
                vacancy_skills = vacancy.required_skills
                missing = {skill: level for skill, level in vacancy_skills.items() if skill not in skills}
                matching_skills_count = len(set(skills) & set(vacancy_skills.keys()))
                total_skills_count = len(vacancy_skills)
                if total_skills_count > 0:
                    percentage = (matching_skills_count / total_skills_count) * 100
                else:
                    percentage = 0
                if suitable_job is None or percentage > match_percentage:
                    suitable_job = vacancy
                    missing_skills = missing
                    match_percentage = percentage
            if suitable_job:
                resume.job = suitable_job.name
                resume.missing_skills = list(missing_skills.keys())
                resume.matchPercentage = match_percentage

            resume.save()

            return resume

        except Exception as e:
            raise serializers.ValidationError({'resume_file': f'Ошибка при обработке файла: {str(e)}'})



class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id',
            'name',
            'job',
            'matchPercentage',
            'skills',
            'missing_skills',
            'resume_file',
            'date',
            'file_name'
        ]


class UserWithResumesSerializer(serializers.ModelSerializer):
    resumes = ResumeSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'lastName', 'image', 'resumes']


class VacancyCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = [
            'id',
            'name',
            'description',
            'required_skills',
        ]

    def create(self, validated_data):
        return Vacancy.objects.create(**validated_data)


class VacancySerializer(serializers.ModelSerializer):
    class Meta:
        model = Vacancy
        fields = [
            'id',
            'name',
            'description',
            'required_skills',
            'created_at',
            'updated_at',
        ]


class JobMatchingCreateSerializer(serializers.ModelSerializer):
    vacancy = serializers.PrimaryKeyRelatedField(read_only=True)
    resume = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = JobMatching
        fields = [
            'id',
            'user',
            'vacancy',
            'resume',
            'match',
            'shortage',
        ]

    def create(self, validated_data):
        return JobMatching.objects.create(**validated_data)


class JobMatchingSerializer(serializers.ModelSerializer):
    vacancy = serializers.PrimaryKeyRelatedField(read_only=True)
    resume = serializers.PrimaryKeyRelatedField(read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = JobMatching
        fields = ['id', 'user', 'vacancy', 'resume', 'match', 'shortage', 'created_at']
