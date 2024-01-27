

```bash
gcloud container clusters get-credentials genvidea-cluster --zone us-central1-f
```

```bash
kubectl get events --sort-by='.metadata.creationTimestamp' > events.log
```