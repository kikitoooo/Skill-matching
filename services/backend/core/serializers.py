from rest_framework import serializers
from users.models import CustomUser as User
from djoser.serializers import UserCreateSerializer, UserSerializer

from processing.models import Resume, Vacancy, JobMatching
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


class CookieTokenRefreshSerializer(TokenRefreshSerializer):
    refresh = None

    def validate(self, attrs):
        attrs['refresh'] = self.context['request'].COOKIES.get('refresh_token')
        if attrs['refresh']:
            return super().validate(attrs)
        else:
            raise InvalidToken('No valid token found in cookie \'refresh_token\'')


class CustomUserCreateSerializer(UserCreateSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'patronymic_name',
            'last_name',
            'password',
        ]

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        user.is_active = True
        if password is not None:
            user.set_password(password)
        user.save()
        return user


class CustomUserSerializer(UserSerializer):
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'username',
            'first_name',
            'patronymic_name',
            'last_name',
        ]


class ResumeCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = [
            'id',
            'first_name',
            'patronymic_name',
            'surname',
            'jobs',
            'skills',
            'resume_file',
        ]

    def create(self, validated_data):
        return Resume.objects.create(**validated_data)


class ResumeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Resume
        fields = [
            'id',
            'first_name',
            'patronymic_name',
            'surname',
            'jobs',
            'skills',
            'resume_file',
            'created_at',
        ]


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
