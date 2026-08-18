from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = "Set ramam as an admin user"

    def handle(self, *args, **options):
        username = "ramam"

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stderr.write(
                self.style.ERROR(f"User '{username}' does not exist.")
            )
            return

        user.role = "ADMIN"
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"'{username}' is now an ADMIN."
            )
        )