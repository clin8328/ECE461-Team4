# Run the AWS CLI command to get the secret value
secret_value=$(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-2:777501491721:secret:EN_content-UcMszU --query SecretString --output text)

# Parse JSON string using bash
GITHUB_TOKEN=$(echo "$secret_value" | sed -n 's/.*"GITHUB_TOKEN": "\(.*\)".*/\1/p')
LOG_FILE=$(echo "$secret_value" | sed -n 's/.*"LOG_FILE": "\(.*\)".*/\1/p')

# Create the .env file with the extracted values
echo "GITHUB_TOKEN='$GITHUB_TOKEN'" > ./.env
echo "LOG_FILE='$LOG_FILE'" >> ./.env

exit 0
