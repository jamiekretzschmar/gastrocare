import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn

app = FastAPI()

# Check if the build directory exists
DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")

if os.path.exists(DIST_DIR):
    # Serve static files from the build directory
    app.mount("/assets", StaticFiles(directory=os.path.join(DIST_DIR, "assets")), name="assets")

    # Catch-all route for SPA (Single Page Application)
    # This ensures that refreshing on a sub-route (e.g. /tracker) serves index.html
    @app.get("/{full_path:path}")
    async def serve_app(full_path: str):
        # If the file exists in dist (e.g. favicon.ico), serve it
        file_path = os.path.join(DIST_DIR, full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)
        
        # Otherwise serve index.html
        return FileResponse(os.path.join(DIST_DIR, "index.html"))
else:
    @app.get("/")
    def read_root():
        return {
            "message": "React build not found. Please run 'npm run build' first.",
            "status": "development_mode"
        }

if __name__ == "__main__":
    print("Starting GastroCare Sync Server...")
    print("Ensure you have run 'npm run build' to generate the frontend assets.")
    uvicorn.run(app, host="0.0.0.0", port=8000)
