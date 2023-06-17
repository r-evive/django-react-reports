from rest_framework_jwt.utils import jwt_payload_handler
from django.core.files.storage import default_storage
from django.http import HttpResponse


def jwt_response_payload_handler(token, user=None, request=None):
    return {
        'token': token,
        'user_id': user.id,
        'email': user.email,
}