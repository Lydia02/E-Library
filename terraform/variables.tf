variable "location" {
  description = "Azure region for resources"
  type        = string
  default     = "Central US"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "elibrary"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "vnet_address_space" {
  description = "Address space for the Virtual Network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "public_subnet_prefix" {
  description = "Address prefix for public subnet (bastion)"
  type        = string
  default     = "10.0.1.0/24"
}

variable "private_subnet_prefix" {
  description = "Address prefix for private subnet (app server)"
  type        = string
  default     = "10.0.2.0/24"
}

variable "db_subnet_prefix" {
  description = "Address prefix for database subnet"
  type        = string
  default     = "10.0.3.0/24"
}

variable "vm_size" {
  description = "Size of the Virtual Machines"
  type        = string
  default     = "Standard_B1s"
}

variable "admin_username" {
  description = "Admin username for VMs"
  type        = string
  default     = "azureuser"
}

variable "db_name" {
  description = "Name of the PostgreSQL database"
  type        = string
  default     = "elibrarydb"
}

variable "db_admin_username" {
  description = "Admin username for PostgreSQL"
  type        = string
  default     = "dbadmin"
}

variable "db_admin_password" {
  description = "Admin password for PostgreSQL"
  type        = string
  sensitive   = true
}

variable "db_sku_name" {
  description = "SKU name for PostgreSQL Flexible Server"
  type        = string
  default     = "B_Standard_B1ms"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Project     = "e-library"
    Environment = "production"
    ManagedBy   = "terraform"
    Course      = "ALU-DevOps-Capstone"
  }
}