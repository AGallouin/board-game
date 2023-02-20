from django.urls import path
from .views import SignupView, UserDetailView

urlpatterns = [   
    path('signup', SignupView.as_view()),
    path('<int:pk>', UserDetailView.as_view())
]