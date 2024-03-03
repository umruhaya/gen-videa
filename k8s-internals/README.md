

```bash
gcloud container clusters get-credentials genvidea-cluster --zone us-central1-f
```

```bash
kubectl get events --sort-by='.metadata.creationTimestamp' > events.log
```

## BusyBox Testing

```bash
kubectl run busybox-test --image=busybox --restart=Never --rm -it -- /bin/sh
```


## YAML Validation

1. Validate YAML with Kustomize by running `kustomize build .`. This will build the final manifest so that we may manually inspect it before applying changes.
2. TO validate directly against the Kubernetes API server, use `kubectl apply -k --dry-run .`
3. with helm the available options are:
    1. `helm template` locally render templates for manual inspection.
    2. `helm lint` to examine a chart for possible issues.
    3. `helm upgrade --dry-run` to check against api serve.

## Versioning and Rollback with helm

TODO: incomplete section - need more details_

- Helm can deploy several versions of the same chart to same cluster at the same time. _need to elaborate it more_
- Helm is refers to a deployment version as a `Revision`
- Helm maintains a history to Revisions and allows rollback to a previous revision

## Secret Management

need to fetch secrets from secret manager using plugins or manual setup.