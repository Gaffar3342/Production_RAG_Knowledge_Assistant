from pydantic import BaseModel
class ChatRequest(BaseModel):
    question:str
    
class ChatResponse(BaseModel):
    answer:str
    source:str
    page:int
    confidence:float
    
class UploadResponse(BaseModel):
    filename:str
    message:str
    