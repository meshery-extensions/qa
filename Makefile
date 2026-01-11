# Copyright Meshery Authors
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

include build/Makefile.core.mk
include build/Makefile.show-help.mk

# --------------------------------------------------
# Helpers
# --------------------------------------------------

define results-sync
	@rm -rf $(2)
	@mkdir -p $(2)
	@if [ -n "$($(1))" ] && [ -d "$($(1))" ]; then \
		echo "Copying results from $($(1)) → $(2)"; \
		cp -r "$($(1))"/* $(2)/ || true; \
	else \
		echo "$(1) not set or directory does not exist, skipping"; \
	fi
endef

# --------------------------------------------------
# Targets
# --------------------------------------------------
.PHONY: report-generate meshery-results-sync mesheryctl-results-sync report-open report

## Sync Meshery Test Results
meshery-results-sync: 
	@echo "Syncing Meshery Test Results..."
	$(call results-sync,MESHERY_RESULTS_PATH,meshery-results)

## Sync mesheryctl Test Results
mesheryctl-results-sync: 
	@echo "Syncing mesheryctl Test Results..."
	$(call results-sync,MESHERYCTL_RESULTS_PATH,mesheryctl-results)


## Setup environment; Install prequisites
report-setup:
	npm i

## Generate fresh QA Report
report-build: 
	@echo "Generating QA Report..."
	rm -rf allure-results || true
	mkdir -p allure-results
	cp kanvas-results/* allure-results/ || true
	cp meshery-results/* allure-results/ || true
	cp mesheryctl-results/* allure-results/ || true
	cp remote-provider-results/* allure-results/ || true
	npm run report:generate

## Open QA report in browser
report: report-build 
	@echo "Opening QA Report..."
	npm run report:open


# --------------------------------------------------
# Extension Targets
# EXTENSION POINT (see https://docs.meshery.io/extensibility)
# OPEN AN ISSUE TO ADD YOUR EXTENSION HERE
# --------------------------------------------------
.PHONY: results-kanvas-sync remote-provider-results-sync

## Sync Kanvas Test Results
results-kanvas-sync: 
	@echo "Syncing Kanvas Test Results..."
	$(call results-sync,KANVAS_RESULTS_PATH,kanvas-results)

## Sync Remote Provider Test Results
remote-provider-results-sync: 
	@echo "Syncing Remote Provider Test Results..."
	$(call results-sync,REMOTE_PROVIDER_RESULTS_PATH,remote-provider-results)

