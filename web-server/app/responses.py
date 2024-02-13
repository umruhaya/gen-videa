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