from django.contrib.auth import get_user_model
from datetime import timedelta
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from core.serializers import CustomUserLoginSerializer, CustomUserSerializer, CustomUserRegistrationSerializer

User = get_user_model()


class UserLoginAPIView(GenericAPIView):

    permission_classes = (AllowAny,)
    serializer_class = CustomUserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = {
            "success": True,
            "accessToken": str(token.access_token),
            "refreshToken": str(token),
            "user": serializer.data,
        }
        return Response(data, status=status.HTTP_200_OK)


class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {"success": False, "message": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            token = RefreshToken(refresh_token)
            token.set_exp(lifetime=timedelta(seconds=1))
            access_token = str(token.access_token)
            token.access_token.set_exp(lifetime=timedelta(seconds=1))
            return Response(
                {"success": True, "message": "Successfully logged out"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except TokenError:
            return Response(
                {"success": False, "message": "Invalid token"},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {"success": False, "message": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserRegistrationAPIView(GenericAPIView):

    permission_classes = (AllowAny,)
    serializer_class = CustomUserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = {
            "success": True,  
            "accessToken": str(token.access_token),
            "refreshToken": str(token),
            "user": serializer.data,  
        }
        return Response(data, status=status.HTTP_201_CREATED)
