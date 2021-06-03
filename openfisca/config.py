import os

bind = os.getenv('OPENFISCA_BIND_HOST', '127.0.0.1:2000')
timeout = 120
workers = os.getenv('OPENFISCA_WORKERS', 8)

profiler = False
if profiler:
    import cProfile
    import pstats
    from io import StringIO
    import logging
    import os
    import tempfile
    import time

    def pre_request(worker, req):
        worker.start_time = time.time()
        worker.profile = cProfile.Profile()
        worker.profile.enable()
        worker.log.info("PROFILING %d: %s" % (worker.pid, req.uri))

    def post_request(worker, req, *args):
        tf = tempfile.NamedTemporaryFile(delete = False)
        worker.log.info("PROFILING RESULT %d: %s http://127.0.0.1:8081/snakeviz/%s" % (worker.pid, req.uri, tf.name))
        worker.profile.dump_stats(tf.name)
