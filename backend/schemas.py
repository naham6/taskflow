from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, description="The title of the task")
    description: Optional[str] = None
    priority: Optional[str] = "low"

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    priority: str

    model_config = ConfigDict(from_attributes=True)

class TaskUpdate(BaseModel):#optionals
    title: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None