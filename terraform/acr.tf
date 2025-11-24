resource "azurerm_container_registry" "main" {
  name                = "${var.project_name}acr${random_string.acr_suffix.result}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = var.tags
}

resource "random_string" "acr_suffix" {
  length  = 6
  special = false
  upper   = false
}