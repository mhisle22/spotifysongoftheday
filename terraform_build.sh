#!/bin/bash

# Function to parse AWS credentials and config files
parse_aws_file() {
    local file_path="$1"
    declare -A result
    if [ -f "$file_path" ]; then
        local in_section=false
        while IFS= read -r line; do
            line=$(echo "$line" | xargs)
            if [[ $line == \[*\] ]]; then
                in_section=true
            elif $in_section && [[ $line =~ ^([^=]+)=(.+)$ ]]; then
                key=$(echo "${BASH_REMATCH[1]}" | xargs)
                value=$(echo "${BASH_REMATCH[2]}" | xargs)
                result[$key]=$value
            fi
        done < "$file_path"
    else
        echo "File not found: $file_path"
    fi
    echo "${!result[@]}"
    for key in "${!result[@]}"; do
        echo "$key=${result[$key]}"
    done
}

# Setup AWS vars
aws_credentials_path="$HOME/.aws/credentials"
aws_config_path="$HOME/.aws/config"

# Parse AWS credentials
declare -A aws_credentials
while IFS= read -r line; do
    key=$(echo "$line" | cut -d= -f1)
    value=$(echo "$line" | cut -d= -f2-)
    aws_credentials[$key]=$value
done < <(parse_aws_file "$aws_credentials_path")

# Parse AWS config
declare -A aws_config
while IFS= read -r line; do
    key=$(echo "$line" | cut -d= -f1)
    value=$(echo "$line" | cut -d= -f2-)
    aws_config[$key]=$value
done < <(parse_aws_file "$aws_config_path")

if [[ -n "${aws_credentials[aws_access_key_id]}" && -n "${aws_credentials[aws_secret_access_key]}" ]]; then
    export AWS_ACCESS_KEY_ID="${aws_credentials[aws_access_key_id]}"
    export AWS_SECRET_ACCESS_KEY="${aws_credentials[aws_secret_access_key]}"
else
    echo "AWS credentials not found."
fi

if [[ -n "${aws_config[region]}" ]]; then
    export AWS_DEFAULT_REGION="${aws_config[region]}"
else
    echo "AWS config not found."
fi

# Print the exported variables (optional)
echo "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY"
echo "AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION"

echo -e "\nSetting up tf variables...\n"

export TF_VAR_aws_key="$AWS_ACCESS_KEY_ID"
export TF_VAR_aws_secret="$AWS_SECRET_ACCESS_KEY"
export TF_VAR_aws_region="$AWS_DEFAULT_REGION"

# Print TF_VAR_ environment variables
env | grep TF_VAR_ | sed -e 's/^/   /'

# Change to the Terraform directory
cd src/app/terraform || exit

# Set the AWS_PROFILE environment variable
export AWS_PROFILE='default'

# Terraform commands
echo -e "\n"
echo "terraform init"
terraform init | sed -e 's/^/   /'
if [ $? -ne 0 ]; then echo "Error on terraform init!"; cd - || exit; exit 1; fi

echo -e "\n"
echo "terraform validate"
terraform validate | sed -e 's/^/   /'
if [ $? -ne 0 ]; then echo "Error on terraform validate!"; cd - || exit; exit 1; fi

echo -e "\n"
echo "terraform plan"
terraform plan | sed -e 's/^/   /'
if [ $? -ne 0 ]; then echo "Error on terraform plan!"; cd - || exit; exit 1; fi

echo -e "\n"
echo "terraform apply"
terraform apply -auto-approve | sed -e 's/^/   /'
if [ $? -ne 0 ]; then echo "Error on terraform apply!"; cd - || exit; exit 1; fi

echo -e "\n"
echo "Terraform build process complete!"

# Change back to the original directory
cd - || exit
