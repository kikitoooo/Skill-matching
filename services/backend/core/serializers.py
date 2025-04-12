from rest_framework import serializers
from users.models import CustomUser as User
from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth import authenticate

from processing.models import Resume, Vacancy, JobMatching
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer

from core.parsers.resume_parser import ResumeParser


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')


class UserWithResumesSerializer(serializers.ModelSerializer):
    resumes = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'last_name', 'image', 'resumes']

    def get_resumes(self, obj):
        matchings = JobMatching.objects.filter(user=obj).select_related('resume')
        resumes = [matching.resume for matching in matchings]
        return ResumeSerializer(resumes, many=True).data


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'name',
            'last_name',
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
        fields = ("id", "name", "last_name", "email", "password", "image")
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class ResumeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id',
            'first_name',
            'patronymic_name',
            'surname',
            'job',
            'skills',
            'resume_file',
            'parsed_resume',
        ]
        read_only_fields = ['parsed_resume']

    def create(self, validated_data):
        uploaded_file = validated_data.get('resume_file')

        if uploaded_file:
            try:
                parsed_resume = ResumeParser.parse_file(uploaded_file)
                resume = Resume.objects.create(
                    **validated_data,
                    parsed_resume=parsed_resume
                )
                return resume
            except Exception as e:
                raise serializers.ValidationError(
                    {'resume_file': f'Ошибка при парсинге файла: {str(e)}'}
                )
        return Resume.objects.create(**validated_data)


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'


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
        fields = [
            'id',
            'name',
            'description',
            'required_skills',
            'created_at',
            'updated_at',
        ]
