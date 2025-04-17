from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.serializers import (CookieTokenRefreshSerializer, ResumeCreateSerializer,
                              ResumeSerializer, VacancyCreateSerializer,
                              VacancySerializer, JobMatchingSerializer)
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin, RetrieveModelMixin
from rest_framework.viewsets import GenericViewSet
from rest_framework.generics import RetrieveUpdateAPIView

from .models import CustomUser, Resume, Vacancy, JobMatching
from core.serializers import UserWithResumesSerializer


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


class UserProfileApiWiew(RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all().prefetch_related(
        'resumes__resume'
    )
    serializer_class = UserWithResumesSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user)
        data = {
            "success": True,
            "user": serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)


    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            user.save()
            data = {
                "success": True,
                "user": serializer.data
            }
            return Response(data, status=status.HTTP_200_OK)

        return Response({
            "success": False,
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ResumeCreateSerializer
        return ResumeSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = ResumeCreateSerializer(data=request.data, context=self.get_serializer_context())
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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


class JobMatchingViewSet(viewsets.ModelViewSet):
    queryset = JobMatching.objects.all()
    serializer_class = JobMatchingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
