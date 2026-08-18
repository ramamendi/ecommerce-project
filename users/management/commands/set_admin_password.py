import os

from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = "Set an admin password from ADMIN_PASSWORD"

    def handle(self, *args, **options):
        password = os.getenv("ADMIN_PASSWORD")

        if not password:
            self.stderr.write(
                self.style.ERROR(
                    "ADMIN_PASSWORD environment variable is missing."
                )
            )
            return

        username = "rama"

        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            self.stderr.write(
                self.style.ERROR(
                    f"User '{username}' does not exist."
                )
            )
            return

        user.set_password(password)
        user.is_staff = True
        user.is_superuser = True
        user.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Admin password updated successfully for '{username}'."
            )
        )