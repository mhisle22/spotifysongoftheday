# Create a directory for the source code and dependencies
New-Item -ItemType Directory -Path "api_handler_source"

# Copy the main handler and utility files to the new directory
Copy-Item -Path "api_handler.py" -Destination "api_handler_source"
Copy-Item -Path "aws_connect.py" -Destination "api_handler_source"

# Create the package directory inside the new directory
New-Item -ItemType Directory -Path "api_handler_source\package"

# Copy the dependencies from the virtual environment's site-packages to the new package directory
Copy-Item -Path "venv\Lib\site-packages\*" -Destination "api_handler_source\package" -Recurse

# Navigate to the new directory
Set-Location -Path "api_handler_source"

# Create a zip file containing all the contents of the new directory
Compress-Archive -Path * -DestinationPath "../api_handler_source.zip"

# Return to the original directory
Set-Location -Path ..

# Remove the temporary directory and its contents
Remove-Item -Path "api_handler_source" -Recurse -Force
