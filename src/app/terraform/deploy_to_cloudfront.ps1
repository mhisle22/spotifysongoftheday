function Debug-Log {
    param (
        [string]$Message
    )

    if ($Env:DEBUG -eq "on") {
        Write-Host $Message
    }
}

function Sync-S3 {
    Write-Host "Deleting all existing objects in the S3 bucket..."
    aws s3 rm s3://spotify-song-of-the-day-deployment-bucket --recursive

    Write-Host "Pushing latest code to S3 bucket..."
    aws s3 sync ../../../dist/songoftheday/ s3://spotify-song-of-the-day-deployment-bucket
}

function List-Distributions {
    Write-Host "Listing all CloudFront distributions..."
    $global:distributions = aws cloudfront list-distributions | ConvertFrom-Json | Select-Object -ExpandProperty DistributionList | Select-Object -ExpandProperty Items | ForEach-Object { $_.Id }
    $global:distributionOrigins = aws cloudfront list-distributions | ConvertFrom-Json | Select-Object -ExpandProperty DistributionList | Select-Object -ExpandProperty Items | ForEach-Object { $_.Origins.Items.DomainName }
    
    Write-Host "Distribution IDs:"
    $global:distributions
    Write-Host "Distribution origins:"
    $global:distributionOrigins
    $global:TOTALDISTRIBUTIONS = $global:distributions.Count
    Write-Host "Total distributions: $global:TOTALDISTRIBUTIONS"
}

function Invalidate-Cache {
    Write-Host "Invalidating cache..."
    $bucket = "spotify-song-of-the-day-deployment-bucket.s3.amazonaws.com"
    for ($COUNT = 0; $COUNT -lt $global:TOTALDISTRIBUTIONS; $COUNT++) {
        Write-Host "$global:distributions"
        Write-Host "$global:distributionOrigins"

        if ($global:distributions -is [array]) {
            $distributionid = $global:distributions[$COUNT]
        } else {
            $distributionid = $global:distributions
        }

        if ($global:distributionOrigins -is [array]) {
            $distributionOrigin = $global:distributionOrigins[$COUNT]
        } else {
            $distributionOrigin = $global:distributionOrigins
        }
        
        if ($distributionOrigin -eq $bucket) {
            Write-Host "Distribution ID: $distributionid"
            Write-Host "$Env:AWS_DEFAULT_REGION"
            $global:distribution_id = $distributionid
            aws cloudfront create-invalidation --region $Env:AWS_DEFAULT_REGION --distribution-id $distributionid --paths "/*"
        }
    }
}

function Get-Invalidations {
    Write-Host "Getting all invalidations..."
    $global:invalidations = aws cloudfront list-invalidations --distribution-id $global:distribution_id | ConvertFrom-Json | Select-Object -ExpandProperty InvalidationList | Select-Object -ExpandProperty Items | Where-Object { $_.Status -ne "Completed" } | Select-Object -ExpandProperty Id
    Write-Host "Invalidations: $global:invalidations"
    if ($global:invalidations.Count -gt 0) {
        Write-Host "Invalidation in progress: $global:invalidations"
    }
}

function Check-Invalidation-Status {
    Write-Host "Checking invalidations..."
    if (-not $global:invalidations) {
        Write-Host "No invalidations in progress"
        return 1
    } else {
        foreach ($invalidationid in $global:invalidations) {
            Write-Host "Invalidation ID: $invalidationid"
            $invalidationStatus = aws cloudfront get-invalidation --distribution-id $global:distribution_id --id $invalidationid | ConvertFrom-Json | Select-Object -ExpandProperty Invalidation | Select-Object -ExpandProperty Status
            while ($invalidationStatus -eq "InProgress") {
                Write-Host "Invalidation status: $invalidationStatus"
                Write-Host "Waiting for invalidation to complete..."
                Start-Sleep -Seconds 30
                $invalidationStatus = aws cloudfront get-invalidation --distribution-id $global:distribution_id --id $invalidationid | ConvertFrom-Json | Select-Object -ExpandProperty Invalidation | Select-Object -ExpandProperty Status
            }
            Write-Host "Invalidation status: $invalidationStatus"
            Write-Host "Done!"
        }
    }
}

Write-Host 'SYNC S3'
Sync-S3
Write-Host 'LIST DISTRIBUTIONS'
List-Distributions
Write-Host 'INVALIDATE CACHE'
Invalidate-Cache
Write-Host 'RETRIEVE INVALIDATION STATUS'
Get-Invalidations
Write-Host 'CHECK INVALIDATIONS'
Check-Invalidation-Status
