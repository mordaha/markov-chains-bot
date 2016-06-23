#!/bin/bash

BASEDIR=$(dirname "${0}")
DC="docker-compose -f ${BASEDIR}/docker-compose-dev.yml"

if ! test -f "${BASEDIR}/deploy/id_rsa.pub"; then
    cp ~/.ssh/id_rsa.pub ${BASEDIR}/deploy/
fi

if test -z "${1}" ; then
    ${DC} build && ${DC} up
else
    case ${1} in
        shell)
            ${DC} exec bot /bin/bash
            ;;
        exec)
            ${DC} exec bot /bin/bash -c "${@:2}"
            ;;
        test)
            ${DC} exec bot /bin/bash -c "cd /opt/bot && npm run test -- ${@:2}"
            ;;
        tdd)
            ${DC} exec bot /bin/bash -c "cd /opt/bot && npm run tdd -- ${@:2}"
            ;;
        log)
            ${DC} exec bot /bin/bash -c "tail -n 100 -f /var/log/app.error.log"
            ;;
        *)
            ${DC} $@
            ;;
    esac
fi
