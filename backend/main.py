from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import database
import schemas

#creating tasks.db file if it doesnt exist
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Task-Flow")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#Creating aconnection to the database
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/api/tasks", response_model=List[schemas.TaskResponse])
def get_tasks(db: Session = Depends(get_db)):
    tasks = db.query(database.Task).all()
    return tasks


@app.post("/api/tasks", response_model=schemas.TaskResponse, status_code=201)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    new_task = database.Task(title=task.title, description=task.description, priority=task.priority)
    db.add(new_task)
    db.commit()
    db.refresh(new_task) 
    return new_task
@app.put("/api/tasks/{task_id}", response_model=schemas.TaskResponse)
def update_task(task_id: int, task_data: schemas.TaskUpdate, db: Session = Depends(get_db)):
    db_task = db.query(database.Task).filter(database.Task.id == task_id).first()
 
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task_data.title is not None:
        db_task.title = task_data.title
    if task_data.description is not None:
        db_task.description = task_data.description
    if task_data.status is not None:
        db_task.status = task_data.status

    if task_data.priority is not None:
        db_task.priority = task_data.priority
        
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/api/tasks/{task_id}/toggle", response_model=schemas.TaskResponse)
def toggle_task_status(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(database.Task).filter(database.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    if db_task.status == "pending":
        db_task.status = "completed"
    else:
        db_task.status = "pending" #default
        
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(database.Task).filter(database.Task.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(db_task)
    db.commit()
    return None