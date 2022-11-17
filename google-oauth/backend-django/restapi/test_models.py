from django.test import TestCase
from model_bakery import baker

customer = baker.make("restapi.Customer", _quantity=10)
assert len(customer) == 10
