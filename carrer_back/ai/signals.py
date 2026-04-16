# from django.db.models.signals import pre_save
# from django.dispatch import receiver
# from .ai import chatbot_first, chatbot_second
#
# @receiver(pre_save, sender=AI)
# def update_gpt_result(sender, instance, **kwargs):
#     created = kwargs.get('created', True)
#     if created:
#         first = chatbot_first(instance.result)
#         instance.first = first
#         second = chatbot_second(first)
#         instance.second = second

    