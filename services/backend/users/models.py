from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    email = models.EmailField('email', max_length=254, unique=True)
    email_confirmed = models.BooleanField(default=False)
    first_name = models.CharField('first_name', max_length=150)
    patronymic_name = models.CharField('patronymic_name', max_length=150)
    surname = models.CharField(max_length=150, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('-pk',)

    @property
    def is_admin(self):
        return self.is_staff or self.is_superuser
# Create your models here.
