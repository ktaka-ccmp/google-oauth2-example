from django.contrib import admin

from django.contrib.sessions.models import Session
class SessionAdmin(admin.ModelAdmin):
    def _session_data(self, obj):
        return obj.get_decoded()
    list_display = ['session_key', '_session_data', 'expire_date']
admin.site.register(Session, SessionAdmin)

from django.contrib.auth.admin import User, UserAdmin

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'id')
    readonly_fields = ('id',)

admin.site.unregister(User)
admin.site.register(User, CustomUserAdmin)
