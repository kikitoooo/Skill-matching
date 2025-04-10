from django.contrib import admin
from users.models import CustomUser as User


@admin.register(User)
class StudentAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'first_name', 'patronymic_name', 'last_name', 'created_at', 'updated_at']
    search_fields = ['username', 'email']
    list_filter = ['username', 'email']
    ordering = ['username']
# Register your models here.
