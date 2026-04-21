terraform {
  required_version = ">= 1.6.0"
}

provider "github" {
  owner = var.github_owner
  token = var.github_token
}

resource "github_repository" "repo" {
  name        = var.repository_name
  description = var.repository_description
  visibility  = "public"
  has_issues  = true
  has_wiki    = false
}

resource "github_repository_pages" "pages" {
  repository = github_repository.repo.name
  build_type = "workflow"
}
