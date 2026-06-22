import hashlib
import sqlite3
import os
from services.pdf_services import extract_text,chunk_text,create_embedding
from vector_store.chroma_db.chroma_dbase import save_chunk_database
from schemas.upload_schema import UploadResponse
def init_db():
    conn=sqlite3.connect("database/documents.db")
    cursor=conn.cursor()
    return conn,cursor

conn,cursor=init_db()
cursor.execute("""CREATE TABLE IF NOT EXISTS documents
               (id INTEGER PRIMARY KEY AUTOINCREMENT,
               filename TEXT,
               filehash TEXT
                   )""")
conn.commit()
cursor.close()

def hash_calculator(content:bytes)->str:
    text_hash= hashlib.sha256(content).hexdigest()
    return text_hash
def save_file(content:bytes,filename:str):
    os.makedirs(f"uploads",exist_ok=True)
    with open(f"uploads/{filename}","wb")as f:
        f.write(content)
def duplicate_hash(filehash:str)->bool:
    conn,cursor=init_db()
    cursor.execute(
        "SELECT * FROM documents WHERE filehash=?",
        (filehash,)
    )
    result=cursor.fetchone()
    conn.close()
    if result is not None:
        return True
    return False
def saved_pdf(filename:str,text_hash:str):
    conn,cursor=init_db()
    cursor.execute("""
                   INSERT INTO documents
                   (filename,filehash)
                   VALUES(?,?)""",(filename,text_hash))
    conn.commit()
    conn.close()
def process(content:bytes,filename:str):
    filehash=hash_calculator(content)
    if duplicate_hash(filehash):
        raise ValueError("Document already exists")
    save_file(content,filename)
    text=extract_text(f"uploads/{filename}")
    chunks=chunk_text(text)
    embeddings=create_embedding(chunks)
    save_chunk_database(chunks,embeddings,filename,filehash)
    saved_pdf(filename,filehash)
    return UploadResponse(
    message="Document uploaded successfully",
    filename=filename,
)