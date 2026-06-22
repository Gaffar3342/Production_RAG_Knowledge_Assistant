from fastapi import File, HTTPException,UploadFile
from fastapi import APIRouter
from services.ignestion_services import process
router=APIRouter()
@router.post("/upload")
async def upload_documents(file:UploadFile=File(...)):
    if not file.filename.lower().endswith("pdf"):
        raise HTTPException(status_code=400,
            detail="please upload pdf documents")
    content=await file.read()
    return process(
        content,
        filename=file.filename,
    )