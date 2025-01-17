import ConversionPanel from "@components/ConversionPanel";
import { EditorPanelProps } from "@components/EditorPanel";
import Form, { InputType } from "@components/Form";
import { useSettings } from "@hooks/useSettings";
import * as React from "react";
import { useCallback } from "react";
import yaml from "yaml";

interface Settings {
  rootName: string;
}

const formFields = [
  {
    type: InputType.TEXT_INPUT,
    key: "rootName",
    label: "Root Schema Name"
  }
];

export default function YamlToZod() {
  const name = "YAML to Zod Schema";

  const [settings, setSettings] = useSettings(name, {
    rootName: "schema"
  });

  const transformer = useCallback(
    async ({ value }) => {
      const yamlToJSON = JSON.stringify(yaml.parse(value));
      const { jsonToZod } = await import("json-to-zod");
      return jsonToZod(JSON.parse(yamlToJSON), settings.rootName, true);
    },
    [settings]
  );

  const getSettingsElement = useCallback<EditorPanelProps["settingElement"]>(
    ({ open, toggle }) => {
      return (
        <Form<Settings>
          title={name}
          onSubmit={setSettings}
          open={open}
          toggle={toggle}
          formsFields={formFields}
          initialValues={settings}
        />
      );
    },
    []
  );

  return (
    <ConversionPanel
      transformer={transformer}
      editorTitle="YAML"
      editorLanguage="yaml"
      resultTitle="Zod Schema"
      resultLanguage={"typescript"}
      editorSettingsElement={getSettingsElement}
      settings={settings}
    />
  );
}
