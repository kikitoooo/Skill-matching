from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
from core.serializers import (CookieTokenRefreshSerializer, ResumeCreateSerializer,
                              ResumeSerializer, VacancyCreateSerializer, VacancySerializer)
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from .models import CustomUser, Resume, Vacancy
from core.serializers import UserWithResumesSerializer
from core.permissions import IsOwnerOrSuperuser


class CookieTokenObtainPairView(TokenObtainPairView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)


class CookieTokenRefreshView(TokenRefreshView):
    def finalize_response(self, request, response, *args, **kwargs):
        if response.data.get('refresh'):
            cookie_max_age = 3600 * 24 * 14  # 14 days
            response.set_cookie('refresh_token', response.data['refresh'], max_age=cookie_max_age, httponly=True)
            del response.data['refresh']
        return super().finalize_response(request, response, *args, **kwargs)

    serializer_class = CookieTokenRefreshSerializer


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().prefetch_related(
        'resumes__resume'
    )
    serializer_class = UserWithResumesSerializer
    permission_classes = permission_classes = [permissions.IsAuthenticated, IsOwnerOrSuperuser]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response({
            "success": True,
            "user": serializer.data
        })

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance != request.user and not request.user.is_superuser:
            return Response(
                {"success": False},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success": True,
            "user": serializer.data
        })



class ResumeViewSet(viewsets.ModelViewSet, RetrieveModelMixin, UpdateModelMixin,
                         DestroyModelMixin, GenericViewSet):
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ResumeSerializer
        return ResumeCreateSerializer

    def get_queryset(self):
        queryset = Resume.objects.all()
        return queryset

    @staticmethod
    def get_fullname(file_name):
        doc = Document(file_name)
        text = "\n".join([paragraph.text for paragraph in doc.paragraphs])

        segmenter = Segmenter()  # Сегментация текста
        morph_vocab = MorphVocab()  # Морфологический словарь

        # Загрузка моделей для NER
        emb = NewsEmbedding()
        morph_tagger = NewsMorphTagger(emb)
        syntax_parser = NewsSyntaxParser(emb)
        ner_tagger = NewsNERTagger(emb)

        # Обработка текста
        doc = Doc(text)
        doc.segment(segmenter)  # Сегментация на токены
        doc.tag_morph(morph_tagger)  # Разметка морфологии
        doc.parse_syntax(syntax_parser)  # Синтаксический разбор
        doc.tag_ner(ner_tagger)  # Извлечение именованных сущностей

        # Извлечение ФИО (PER — персона)
        for span in doc.spans:
            if span.type == "PER":
                span.normalize(morph_vocab)
                return span.text

    def create(self, request, *args, **kwargs):

        serializer = ResumeCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {
            "success": True,
            "resume": serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)

    def list(self, request, *args, **kwargs):
        resumes = self.get_queryset()
        serializer = self.get_serializer(resumes, many=True)
        data = {
            "success": True,
            "resumes": serializer.data
        }
        return Response(data, status=status.HTTP_200_OK)


class VacancyViewSet(viewsets.ModelViewSet, RetrieveModelMixin, UpdateModelMixin,
                         DestroyModelMixin, GenericViewSet):
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return VacancySerializer
        return VacancyCreateSerializer

    def get_queryset(self):
        queryset = Vacancy.objects.all()
        return queryset

    def create(self, request, *args, **kwargs):

        serializer = VacancyCreateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
