"""completion table added

Revision ID: bcdb799ab0b2
Revises: 607ddd26c8d6
Create Date: 2024-04-12 20:31:58.928203

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "bcdb799ab0b2"
down_revision: Union[str, None] = "607ddd26c8d6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "completions",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("created_at", sa.DateTime(), nullable=False),
        sa.Column("user_email", sa.String(length=64), nullable=False),
        sa.Column("category", sa.String(length=64), nullable=False),
        sa.Column("completion", sa.Text(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_email"],
            ["auth_user.email"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "completion_file_link",
        sa.Column("completion_id", sa.Integer(), nullable=False),
        sa.Column("file_uuid", sa.String(length=64), nullable=False),
        sa.ForeignKeyConstraint(
            ["completion_id"],
            ["completions.id"],
        ),
        sa.ForeignKeyConstraint(
            ["file_uuid"],
            ["file.uuid"],
        ),
        sa.PrimaryKeyConstraint("completion_id", "file_uuid"),
    )
    op.alter_column(
        "auth_user", "username", existing_type=sa.VARCHAR(length=64), nullable=False
    )
    op.alter_column(
        "file", "user_email", existing_type=sa.VARCHAR(length=256), nullable=False
    )


def downgrade() -> None:
    op.alter_column(
        "file", "user_email", existing_type=sa.VARCHAR(length=256), nullable=True
    )
    op.alter_column(
        "auth_user", "username", existing_type=sa.VARCHAR(length=64), nullable=True
    )
    op.drop_table("completion_file_link")
    op.drop_table("completions")