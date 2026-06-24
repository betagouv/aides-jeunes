def test_ruamel_yaml_importable():
    from ruamel.yaml import YAML
    yaml = YAML()
    assert yaml is not None
