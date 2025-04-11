from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.generics import GenericAPIView, RetrieveUpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from core.serializers import CustomUserLoginSerializer, CustomUserSerializer

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
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"success": True, "message": "Successful logout"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)
