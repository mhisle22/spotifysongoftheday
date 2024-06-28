function Parse-AwsFile {
    param (
        [string]$filePath
    )
    $result = @{}
    if (Test-Path $filePath) {
        $inSection = $false
        Get-Content $filePath | ForEach-Object {
            $_ = $_.Trim()
            if ($_.StartsWith("[") -and $_.EndsWith("]")) {
                $inSection = $true
            } elseif ($inSection -and $_ -match '^\s*([^=]+)\s*=\s*(.+)\s*$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                $result[$key] = $value
            }
        }
    } else {
        Write-Output "File not found: $filePath"
    }
    return $result
}


# Setup aws vars
$awsCredentialsPath = "$env:USERPROFILE\.aws\credentials"
$awsConfigPath = "$env:USERPROFILE\.aws\config"

$awsCredentials = Parse-AwsFile -filePath $awsCredentialsPath
$awsConfig = Parse-AwsFile -filePath $awsConfigPath

if ($awsCredentials.ContainsKey('aws_access_key_id') -and $awsCredentials.ContainsKey('aws_secret_access_key')) {
    $env:AWS_ACCESS_KEY_ID = $awsCredentials['aws_access_key_id']
    $env:AWS_SECRET_ACCESS_KEY = $awsCredentials['aws_secret_access_key']
} else {
    Write-Output "AWS credentials not found."
}

if ($awsConfig.ContainsKey('region')) {
    $env:AWS_DEFAULT_REGION = $awsConfig['region']
} else {
    Write-Output "AWS config not found."
}

# Print the exported variables (optional)
Write-Output "AWS_ACCESS_KEY_ID=$env:AWS_ACCESS_KEY_ID"
Write-Output "AWS_SECRET_ACCESS_KEY=$env:AWS_SECRET_ACCESS_KEY"
Write-Output "AWS_DEFAULT_REGION=$env:AWS_DEFAULT_REGION"

Write-Output "`nSetting up tf variables...`n"

$env:TF_VAR_aws_key = $env:AWS_ACCESS_KEY_ID
$env:TF_VAR_aws_secret = $env:AWS_SECRET_ACCESS_KEY
$env:TF_VAR_aws_region = $env:AWS_DEFAULT_REGION

Get-ChildItem Env:TF_VAR_* | ForEach-Object { Write-Output "   $($_.Name)=$($_.Value)" }

Set-Location -Path "src/app/terraform"

$env:AWS_PROFILE = 'default'

Write-Output "`n"
Write-Output "terraform init"
terraform init | ForEach-Object { Write-Output "   $_" }
if ($LASTEXITCODE -ne 0) { Write-Output "Error on terraform init!"; Set-Location -Path "../../.."; exit 1 }

Write-Output "`n"
Write-Output "terraform validate"
terraform validate | ForEach-Object { Write-Output "   $_" }
if ($LASTEXITCODE -ne 0) { Write-Output "Error on terraform validate!"; Set-Location -Path "../../.."; exit 1 }

Write-Output "`n"
Write-Output "terraform plan"
terraform plan | ForEach-Object { Write-Output "   $_" }
if ($LASTEXITCODE -ne 0) { Write-Output "Error on terraform plan!"; Set-Location -Path "../../.."; exit 1 }

Write-Output "`n"
Write-Output "terraform apply"
terraform apply -auto-approve | ForEach-Object { Write-Output "   $_" }
if ($LASTEXITCODE -ne 0) { Write-Output "Error on terraform apply!"; Set-Location -Path "../../.."; exit 1 }

Write-Output "`n"
Write-Output "Terraform build process complete!"

Set-Location -Path "../../.."
