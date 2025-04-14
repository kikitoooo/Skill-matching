from django.contrib import admin
from users.models import CustomUser as User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'first_name', 'lastName', 'created_at', 'updated_at']
    search_fields = ['name', 'email']
    list_filter = ['name', 'email']
    ordering = ['name']
# Register your models here.
