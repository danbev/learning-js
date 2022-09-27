FROM registry.access.redhat.com/ubi8 as base

ENV CNB_USER_ID=1000
ENV CNB_GROUP_ID=1000
ENV CNB_STACK_ID="com.redhat.stacks.ubi"
LABEL io.buildpacks.stack.id="com.redhat.stacks.ubi"

RUN groupadd cnb --gid ${CNB_GROUP_ID} && \
  useradd --uid ${CNB_USER_ID} --gid ${CNB_GROUP_ID} -m -s /bin/bash cnb

#Install common packages
# TODO: not sure what might be needed here yet.


FROM base as run

#Set user and group (as declared in base image)
USER ${CNB_USER_ID}:${CNB_GROUP_ID}


FROM base as build

# Install any things required for our base
# TODO: not sure what might be needed here yet.

# Set user and group (as declared in base image)
USER ${CNB_USER_ID}:${CNB_GROUP_ID}
