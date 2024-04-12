from google.cloud import storage
from datetime import timedelta
import io

def list_files(bucket_name, prefix=None):
    storage_client = storage.Client()
    blobs = storage_client.list_blobs(bucket_name, prefix=prefix)
    return blobs

def upload_file_to_storage(file, bucket_name: str, filename: str, content_type='image/png') -> bool:
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    # Create a blob object
    blob = bucket.blob(filename)
    # Read the file content
    content = file.read()
    # Upload the content to the blob
    blob.upload_from_string(content,num_retries=3, content_type=content_type)
    return True

def download_file_from_storage(bucket_name, blob_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)
    file_obj = io.BytesIO()
    blob.download_to_file(file_obj)
    file_obj.seek(0)  # Move to the beginning of the file-like object
    return file_obj

def does_file_exist(bucket_name, blob_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blobs = bucket.list_blobs(prefix=blob_name)
    return len(list(blobs)) > 0

def generate_put_presigned_url(bucket_name, blob_name, content_type, expiration: timedelta = timedelta(hours=24)):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    url = blob.generate_signed_url(
        version="v4",
        expiration=expiration,
        method="PUT",
        content_type=content_type,
    )
    return url

def generate_get_presigned_url(bucket_name, blob_name, expiration: timedelta = timedelta(hours=24)):
    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)
    url = blob.generate_signed_url(
        version="v4",
        expiration=expiration,
        method="GET",
    )
    return url


def delete_storage_blob(bucket_name, blob_name):
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(blob_name)
    blob.delete()
    return True