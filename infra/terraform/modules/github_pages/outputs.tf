output "repository_url" {
  value = github_repository.repo.html_url
}

output "pages_url" {
  value = github_repository_pages.pages.html_url
}
