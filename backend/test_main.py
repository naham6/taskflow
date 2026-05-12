from fastapi.testclient import TestClient
from main import app

#fake browser
client = TestClient(app)

def creatingtask():
    response = client.post(
        "/api/tasks",
        json={
            "title": "Unit Test Task", 
            "description": "Testing", 
            "priority": "high"
        }
    )
    assert response.status_code == 201
    
    data = response.json()
    assert data["title"] == "Unit Test Task"
    assert data["description"] == "Testing"
    assert data["priority"] == "high"
    assert "id" in data 

def taskempty():
    response = client.post(
        "/api/tasks",
        json={
            "title": "",
            "description": "fail"
        }
    )
    assert response.status_code == 422



def updatetask():

    create_res = client.post("/api/tasks", json={"title": "sample", "priority": "low"})
    task_id = create_res.json()["id"]

    update_res = client.put(
        f"/api/tasks/{task_id}",
        json={
            "title": "Updated Title",
            "description": "changed",
            "priority": "medium"
        }
    )

    assert update_res.status_code == 200
    data = update_res.json()
    assert data["title"] == "Updated Title"
    assert data["priority"] == "medium"

def test_delete_nonexistent_task():
    response = client.delete("/api/tasks/420")
    
    assert response.status_code == 404