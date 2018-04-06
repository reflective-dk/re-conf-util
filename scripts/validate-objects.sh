#!/bin/sh

re validate -j build/objects.json > build/validation-results.json

if [ -s build/validation-results.json ]
then
    jq -c '.objects | .[].registrations[0].validity[0].input | {
        subjectId: .subject.id,
        subjectClass: (.subjectClass.id + " (" +.subjectClass.name + ")"),
        severity: .severity, validations: .validations
    }' build/validation-results.json
    jq '.objects | [ .[].registrations[0].validity[0].input.validations | .[].severity ] | unique |
        if (. == [ "none" ])
        then "=== validation ok ==="
        else "=== VALIDATION FAILED: " + (. | tostring) + " ==="
        end' build/validation-results.json
else
    echo 'validation failed - build/validation-results.json is empty'
fi
