unauthorized_response = {
    "description": "Error: Unauthorized",
    "content": {
        "application/json": {"example": {"detail": "Could not validate user."}}
    }
}

conflict_response = {
    "description": "Error: Conflict",
    "content": {
        "application/json": {"example": {"detail": "Email already exists."}}
    }
}

not_found_response = {
    "description": "Error: Not Found",
    "content": {
        "application/json": {"example": {"detail": "Item not found."}}
    }
}

media_type_not_supported = {
    "description": "Error: Media Type Not Supported",
    "content": {
        "application/json": {"example": {"detail": "Media type not supported."}}
    }
}

bad_request_response = {
    "description": "Error: Bad Request",
    "content": {
        "application/json": {"example": {"detail": "Bad request."}}
    }
}