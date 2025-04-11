from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.serializers import (CookieTokenRefreshSerializer, CustomUserSerializer,
                              CustomUserCreateSerializer, ResumeCreateSerializer,
                              ResumeSerializer, VacancyCreateSerializer, VacancySerializer)
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.mixins import ListModelMixin, CreateModelMixin, UpdateModelMixin, DestroyModelMixin, \
    RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet

from .models import CustomUser, Resume, Vacancy


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


class UserProfileViewSet(viewsets.ModelViewSet, RetrieveModelMixin, UpdateModelMixin,
                         DestroyModelMixin, GenericViewSet):

    permission_classes = [permissions.AllowAny, ]

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CustomUserSerializer
        return CustomUserCreateSerializer

    def get_queryset(self):
        queryset = CustomUser.objects.filter(username=self.request.user)
        return queryset

    def create(self, request, *args, **kwargs):
        serializer = CustomUserCreateSerializer(data=request.data)
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


class ResumeViewSet(viewsets.ModelViewSet, RetrieveModelMixin, UpdateModelMixin,
                         DestroyModelMixin, GenericViewSet):
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ResumeSerializer
        return ResumeCreateSerializer

    def get_queryset(self):
        queryset = Resume.objects.all()
        return queryset

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
# Create your views here.
