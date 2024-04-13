"""add bio to user + fix nullable constraint

Revision ID: dd05ca2ca447
Revises: bcdb799ab0b2
Create Date: 2024-04-13 12:50:43.937533

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dd05ca2ca447'
down_revision: Union[str, None] = 'bcdb799ab0b2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('auth_user', sa.Column('bio', sa.String(length=512), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('auth_user', 'bio')
    # ### end Alembic commands ###
