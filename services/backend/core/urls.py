"""
URL configuration for myproject project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from processing.views import (CookieTokenObtainPairView, CookieTokenRefreshView, UserProfileApiWiew,
                              ResumeViewSet, VacancyViewSet)
from rest_framework.routers import DefaultRouter

from users.views import UserLoginAPIView, UserLogoutAPIView, UserRegistrationAPIView


router = DefaultRouter()

router.register(r'resume',
                ResumeViewSet,
                basename='resume'
                )
router.register(r'vacancy',
                VacancyViewSet,
                basename='vacancy'
                )

urlpatterns = [
    path('user-info/', UserProfileApiWiew.as_view(), name='user-info'),
    path('auth/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path("register/", UserRegistrationAPIView.as_view(), name="create-user"),
    path("login/", UserLoginAPIView.as_view(), name="login-user"),
    path("logout/", UserLogoutAPIView.as_view(), name="logout-user"),
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
]
