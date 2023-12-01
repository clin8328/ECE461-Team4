# Extract values from JSON and format them
SECRET_STRING=$(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-2:777501491721:secret:EN_content-UcMszU --query SecretString --output text)
GITHUB_TOKEN=$(echo "$SECRET_STRING" | awk -F'"' '/GITHUB_TOKEN/{print $4}')
LOG_FILE=$(echo "$SECRET_STRING" | awk -F'"' '/LOG_FILE/{print $4}')

# Write the formatted values to .env file
echo "GITHUB_TOKEN='$GITHUB_TOKEN'" > ./.env
echo "LOG_FILE='$LOG_FILE'" >> ./.env

exit 0