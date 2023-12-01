# Install jq
sudo yum install jq -y

# Run the AWS CLI command to get the secret value
secret_value=$(aws secretsmanager get-secret-value --secret-id arn:aws:secretsmanager:us-east-2:777501491721:secret:EN_content-UcMszU --query SecretString --output text)

# Parse JSON string using jq
GITHUB_TOKEN=$(echo "$secret_value" | jq -r '.GITHUB_TOKEN')
LOG_FILE=$(echo "$secret_value" | jq -r '.LOG_FILE')

# Create the .env file with the extracted values
echo "GITHUB_TOKEN='$GITHUB_TOKEN'" > ./.env
echo "LOG_FILE='$LOG_FILE'" >> ./.env

exit 0
