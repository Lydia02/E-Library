output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.main.name
}

output "vnet_id" {
  description = "ID of the Virtual Network"
  value       = azurerm_virtual_network.main.id
}

output "bastion_public_ip" {
  description = "Public IP of the Bastion host"
  value       = azurerm_public_ip.bastion.ip_address
}

output "app_server_public_ip" {
  description = "Public IP of the App server"
  value       = azurerm_public_ip.app.ip_address
}

output "postgresql_fqdn" {
  description = "FQDN of the PostgreSQL server"
  value       = azurerm_postgresql_flexible_server.main.fqdn
  sensitive   = true
}

output "acr_name" {
  description = "Name of the Azure Container Registry"
  value       = azurerm_container_registry.main.name
}

output "acr_login_server" {
  description = "Login server for the Azure Container Registry"
  value       = azurerm_container_registry.main.login_server
}

output "ssh_private_key" {
  description = "Private SSH key for VM access"
  value       = tls_private_key.ssh.private_key_pem
  sensitive   = true
}

output "ssh_to_bastion" {
  description = "SSH command to connect to bastion"
  value       = "ssh -i e-library-key.pem ${var.admin_username}@${azurerm_public_ip.bastion.ip_address}"
}

output "app_frontend_url" {
  description = "URL to access the frontend"
  value       = "http://${azurerm_public_ip.app.ip_address}:3000"
}

output "app_backend_url" {
  description = "URL to access the backend API"
  value       = "http://${azurerm_public_ip.app.ip_address}:5000"
}