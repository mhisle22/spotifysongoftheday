function debug() {
    [ "$DEBUG" == "on" ] && "$@"
}

BUCKET_NAME="spotify-song-of-the-day-deployment-bucket"
LOCAL_DIRECTORY="../../../dist/songoftheday/"

# Function to sync the S3 bucket
sync_s3() {
    echo "Deleting all existing objects in the S3 bucket..."
    aws s3 rm s3://$BUCKET_NAME --recursive

    echo "Pushing latest code to S3 bucket..."
    aws s3 sync $LOCAL_DIRECTORY s3://$BUCKET_NAME
}

function list_distributions {
    echo "Listing all CloudFront distributions..."
    distributions=$(aws cloudfront list-distributions | jq '.DistributionList.Items[].Id' | cut -d \" -f2)
    distribution_origins=$(aws cloudfront list-distributions | jq '.DistributionList.Items[].Origins.Items[].DomainName' | cut -d \" -f2)
    echo "Distribution IDs:"
    echo "$distributions"
    echo "Distribution origins:"
    echo "$distribution_origins"
    TOTALDISTRIBUTIONS=$(echo "$distributions" | wc -l | rev | cut -d " " -f1 | rev)
    echo "Total distributions: $TOTALDISTRIBUTIONS"
}

function invalidate_cache {
    echo "Invalidating cache..."
    START=1
    for ((COUNT = START; COUNT <= TOTALDISTRIBUTIONS; COUNT++)); do 
        bucket="spotify-song-of-the-day-deployment-bucket.s3.amazonaws.com"
        distributionid=$(echo "$distributions" | nl | grep -w [^0-9][[:space:]]$COUNT | cut -f2)
        distribution_origin=$(echo "$distribution_origins" | nl | grep -w [^0-9][[:space:]]$COUNT | cut -f2)
        if [ "$distribution_origin" == "$bucket" ]; then
            echo "Distribution ID: $distributionid"
            distribution_id=${distributionid}
            aws cloudfront create-invalidation --region "$AWS_DEFAULT_REGION" --distribution-id "$distributionid" --paths "/*"
        fi 
    done
}

function get_invalidations {
    echo "Getting all invalidations..."
    invalidations=$(aws cloudfront list-invalidations --distribution-id "$distribution_id" | jq '.InvalidationList.Items[] | select(.Status != "Completed") | .Id' | cut -d \" -f2)
    echo "Invalidations: $invalidations"
    if [ -n "$invalidations" ]; then
        echo "Invalidation in progress: $invalidations"
    fi
}

function check_invalidation_status {
    echo "Checking invalidations..."
    if [ -z "$invalidations" ]; then
        echo "No invalidations in progress"
        return 1
    else
        while IFS= read -r invalidationid; do
            echo "Invalidation ID: $invalidationid"
            invalidationStatus=$(aws cloudfront get-invalidation --distribution-id "$distribution_id" --id "$invalidationid" | jq '.Invalidation.Status' | cut -d \" -f2)
            while [ "$invalidationStatus" = "InProgress" ]; do
                echo "Invalidation status: $invalidationStatus"
                echo "Waiting for invalidation to complete..."
                sleep 30
                invalidationStatus=$(aws cloudfront get-invalidation --distribution-id "$distribution_id" --id "$invalidationid" | jq '.Invalidation.Status' | cut -d \" -f2)
            done
            echo "Invalidation status: $invalidationStatus"
            echo "Done!"
        done <<< "$invalidations"
    fi
}

echo 'SYNC S3\n'
sync_s3
echo 'LIST DISTRIBUTIONS\n'
list_distributions
echo 'INVALIDATE CACHE\n'
invalidate_cache
echo 'RETRIEVE INVALIDATION STATUS\n'
get_invalidations
echo 'CHECK INVALIDATIONS\n'
check_invalidation_status
