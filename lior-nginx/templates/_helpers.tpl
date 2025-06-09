{{/*
Expand the name of the chart.
*/}}
{{- define "lior-nginx.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "lior-nginx.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "lior-nginx.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "lior-nginx.labels" -}}
helm.sh/chart: {{ include "lior-nginx.chart" . }}
{{ include "lior-nginx.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "lior-nginx.selectorLabels" -}}
app.kubernetes.io/name: {{ include "lior-nginx.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "lior-nginx.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "lior-nginx.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Return the Service type, forcing ClusterIP if ingress is enabled.
*/}}
{{- define "lior-nginx.serviceType" -}}
{{- if .Values.ingress.enabled -}}
ClusterIP
{{- else -}}
{{- default (or .Values.service.type "ClusterIP") .Values.service.type -}}
{{- end -}}
{{- end }}

{{/* 
Return the port the Service exposes 
*/}}
{{- define "lior-nginx.servicePort" -}}
{{- default .Values.service.port 80 -}}
{{- end }}

{{/* 
Return the targetPort for the Service (and for probes) 
*/}}
{{- define "lior-nginx.targetPort" -}}
{{- default .Values.service.targetPort (include "lior-nginx.servicePort" .) -}}
{{- end }}

{{/* 
Return the full image reference 
*/}}
{{- define "lior-nginx.image" -}}
{{- printf "%s:%s" .Values.image.repository .Values.image.tag -}}
{{- end }}